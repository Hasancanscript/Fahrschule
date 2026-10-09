const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, mocks) {
 const module = { exports: {} };
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { module, exports: module.exports, Response, Date, Buffer, require: name => name in mocks ? mocks[name] : require(name) });
 return module.exports;
}
const { notifyCustomer } = load('src/lib/customer-notifications.ts', {});
const ids = load('src/lib/gift-identifiers.ts', {});
const next = { NextResponse: { json: (data, init) => Response.json(data, init) }, after: () => {} };
function request(body) { return new Request('http://localhost/api', { method: 'PATCH', body: JSON.stringify(body) }); }
const context = { params: Promise.resolve({ id: 'booking' }) };
function bookingFixture() {
 let role = 'ADMIN', failNotification = false;
 let store = { booking: { id: 'booking', userId: 'owner', status: 'PENDING', slotId: 'slot', userPackageId: 'abo' }, credit: 2, booked: true, notices: [] };
 const tx = {
  booking: {
   findUniqueOrThrow: async ({ include }) => include ? { ...store.booking, service: { name: 'Fahrstunde' }, slot: { startTime: new Date('2026-12-12T09:00:00Z') }, user: { id: 'owner' } } : { ...store.booking },
   updateMany: async ({ where, data }) => { if (where.status !== store.booking.status) return { count: 0 }; Object.assign(store.booking, data); return { count: 1 }; },
  },
  slot: { update: async () => { store.booked = false; } },
  userPackage: { update: async () => { store.credit++; } },
  customerNotification: { create: async ({ data }) => { if (failNotification) throw Error('notification failed'); store.notices.push(data); } },
 };
 const route = load('src/app/api/bookings/[id]/route.ts', {
  'next/server': next, '@/auth': { auth: async () => ({ user: { id: 'admin', role } }) }, '@/lib/customer-notifications': { notifyCustomer }, '@/lib/invoices': { cancelInvoice: async () => {} },
  '@/lib/prisma': { prisma: { $transaction: async work => { const snapshot = structuredClone(store); try { return await work(tx); } catch(error) { store=snapshot; throw error; } } } },
 });
 return { get store() { return store; }, setRole: value => { role=value; }, fail: () => { failNotification=true; }, patch: status => route.PATCH(request({ status }),context) };
}
test('admin confirmation is saved for the booking owner once', async () => {
 const f=bookingFixture(); assert.equal((await f.patch('CONFIRMED')).status,200);
 assert.equal(f.store.notices.length,1); assert.equal(f.store.notices[0].kind,'BOOKING_CONFIRMED'); assert.equal(f.store.notices[0].userId,'owner');
 assert.equal((await f.patch('CONFIRMED')).status,200); assert.equal(f.store.notices.length,1);
});
test('Abo cancellation returns credit and saves a cancellation notice once', async () => {
 const f=bookingFixture(); assert.equal((await f.patch('CANCELLED')).status,200);
 assert.equal(f.store.credit,3); assert.equal(f.store.notices[0].detail.creditReturned,true);
 assert.equal((await f.patch('CANCELLED')).status,200); assert.equal(f.store.credit,3); assert.equal(f.store.notices.length,1);
});
test('failed notification rolls back the admin change; customers cannot confirm bookings', async () => {
 const f=bookingFixture(); f.fail(); assert.equal((await f.patch('CANCELLED')).status,409); assert.equal(f.store.booking.status,'PENDING'); assert.equal(f.store.credit,2); assert.equal(f.store.booked,true);
 f.setRole('CUSTOMER'); assert.equal((await f.patch('CONFIRMED')).status,403); assert.equal(f.store.notices.length,0);
});
test('notification reads and acknowledgement are scoped to the authenticated owner', async () => {
 let userId='owner';
 const rows=[{id:'own',userId:'owner',readAt:null},{id:'other',userId:'someone-else',readAt:null}];
 const route=load('src/app/api/account/notifications/route.ts',{
  '@/auth':{auth:async()=>userId ? {user:{id:userId}} : null},
  '@/lib/prisma':{prisma:{customerNotification:{
   findMany:async ({where})=>rows.filter(row=>row.userId===where.userId && row.readAt===where.readAt),
   updateMany:async ({where,data})=>{let count=0;for(const row of rows)if(row.userId===where.userId && row.readAt===null && where.id.in.includes(row.id)){row.readAt=data.readAt;count++;}return {count};},
  }}},
 });
 assert.deepEqual((await (await route.GET()).json()).map(row=>row.id),['own']);
 assert.equal((await route.PATCH(request({ids:['own','other']}))).status,200); assert.ok(rows[0].readAt); assert.equal(rows[1].readAt,null);
 assert.deepEqual(await (await route.GET()).json(),[]);
 userId=null;assert.equal((await route.GET()).status,401);assert.equal((await route.PATCH(request({ids:['other']}))).status,401);
});
function giftFixture() {
 let store={order:{id:'order',userId:'owner',number:'GB-TEST',status:'OPEN',paidAt:null,paidMethod:null,totalCents:10000,createdAt:new Date('2026-10-01T12:00:00Z'),vouchers:[{id:'v',status:'INACTIVE',amountCents:10000,remainingCents:0}]},notices:[]};
 const tx={
  giftOrder:{findUniqueOrThrow:async()=>structuredClone(store.order),update:async({data})=>Object.assign(store.order,data)},
  giftVoucher:{update:async({data})=>Object.assign(store.order.vouchers[0],data),updateMany:async({data})=>Object.assign(store.order.vouchers[0],data)},
  giftEvent:{create:async()=>{}},customerNotification:{create:async({data})=>store.notices.push(data)},
 };
 const route=load('src/app/api/admin/gifts/route.ts',{
  'next/server':next,'@/auth':{auth:async()=>({user:{id:'admin',role:'ADMIN'}})},'@/lib/customer-notifications':{notifyCustomer},
  '@/lib/gift-server':{giftCode:ids.giftCode,giftError:error=>Response.json({error:error.message},{status:400})},
  '@/lib/gift-mail':{},'@/lib/billing':{swissDay:()=> '2026-10-01',paymentDate:day=>new Date(day+'T12:00:00Z')},
  '@/lib/prisma':{prisma:{$transaction:async work=>{const snapshot=structuredClone(store);try{return await work(tx);}catch(error){store=snapshot;throw error;}}}},
 });
 return {get store(){return store;},patch:body=>route.PATCH(request({id:'order',...body}))};
}
test('gift payment activates a voucher and saves a notice; retries do not duplicate it',async()=>{
 const f=giftFixture(),input={action:'pay',method:'CASH',date:'2026-10-09',confirmed:true};
 assert.equal((await f.patch(input)).status,200);assert.equal(f.store.order.vouchers[0].status,'ACTIVE');assert.equal(f.store.notices[0].kind,'GIFT_PAID');assert.equal(f.store.notices[0].userId,'owner');
 assert.match(f.store.order.vouchers[0].code,/^GS-(?:[23456789A-HJ-NP-Z]{4}-){3}[23456789A-HJ-NP-Z]{4}$/);
 assert.equal((await f.patch(input)).status,200);assert.equal(f.store.notices.length,1);
});
test('gift cancellation saves one persistent notice',async()=>{
 const f=giftFixture();const input={action:'cancel',reason:'Test'};
 assert.equal((await f.patch(input)).status,200);assert.equal(f.store.notices[0].kind,'GIFT_CANCELLED');assert.equal(f.store.order.status,'CANCELLED');
 assert.equal((await f.patch(input)).status,200);assert.equal(f.store.notices.length,1);
});
test('new gift codes retain 16 random base-32 characters and omit ambiguous letters',()=>{
 const codes=Array.from({length:1000},()=>ids.giftCode());assert.equal(new Set(codes).size,1000);
 for(const code of codes){assert.equal(code.length,22);assert.match(code,/^GS-(?:[23456789A-HJ-NP-Z]{4}-){3}[23456789A-HJ-NP-Z]{4}$/);}
 assert.match(ids.giftNumber(),/^GB-[23456789A-HJ-NP-Z]{5}-[23456789A-HJ-NP-Z]{5}$/);
});
