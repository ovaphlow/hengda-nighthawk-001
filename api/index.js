const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");

const logger = require("../../../hengda-harold/hengda-pitchfork/dispatcher/util/bunyan");
const postgres = require("../../../hengda-harold/hengda-pitchfork/dispatcher/util/postgres");

const app = new Koa();

app.env = "production";

app.use(bodyParser());

const router = new Router({
	prefix: "/api/nighthawk-001",
});

router.get("/:id", async (ctx) => {
	const cnx = await postgres.connect();
	try {
		const sql = `
    select * from nighthawk."001" where id = $1 limit 1
    `;
		const result = await cnx.query(sql, [parseInt(ctx.params.id, 10)]);
		ctx.response.status = 200;
		ctx.response.body = !!result.rows.length ? result.rows[0] : {};
	} catch (err) {
		logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
		ctx.response.status = 500;
	}
});

router.post("/", async (ctx) => {
	const cnx = await postgres.connect();
	try {
		const sql = `
      insert into nighthawk."001" 
        (dept,datime,route,rail,gongdian,duandian,team) 
      values 
        ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7)
    `;
		await cnx.query(sql, [
      ctx.request.body.dept,
			ctx.request.body.datime,
			ctx.request.body.route,
			ctx.request.body.rail,
			JSON.stringify({
				staff1: ctx.request.body.g_staff1,
				staff2: ctx.request.body.g_staff2,
				staff3: ctx.request.body.g_staff3,
				staff4: ctx.request.body.g_staff4,
				datime: ctx.request.body.g_datime,
				category: ctx.request.body.g_category,
			}),
			JSON.stringify({
				staff1: ctx.request.body.s_staff1,
				staff2: ctx.request.body.s_staff2,
				staff3: ctx.request.body.s_staff3,
				staff4: ctx.request.body.s_staff4,
				datime: ctx.request.body.s_datime,
			}),
			ctx.request.body.team,
		]);
		ctx.response.status = 200;
	} catch (err) {
		logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
		ctx.response.status = 500;
	}
});

router.put("/:id", async (ctx) => {
	const cnx = await postgres.connect();
	try {
		const sql = `
      update  
        nighthawk."001" 
      set
        dept = $1,
        datime = $2,
        route = $3,
        rail = $4,
        gongdian = $5::jsonb,
        duandian = $6::jsonb,
        team = $7
      where id = $8
    `;
		await cnx.query(sql, [
			ctx.request.body.dept,
			ctx.request.body.datime,
			ctx.request.body.route,
			ctx.request.body.rail,
			JSON.stringify({
				staff1: ctx.request.body.g_staff1,
				staff2: ctx.request.body.g_staff2,
				staff3: ctx.request.body.g_staff3,
				staff4: ctx.request.body.g_staff4,
				datime: ctx.request.body.g_datime,
				category: ctx.request.body.g_category,
			}),
			JSON.stringify({
				staff1: ctx.request.body.s_staff1,
				staff2: ctx.request.body.s_staff2,
				staff3: ctx.request.body.s_staff3,
				staff4: ctx.request.body.s_staff4,
				datime: ctx.request.body.s_datime,
			}),
			ctx.request.body.team,
			parseInt(ctx.params.id, 10),
		]);
		ctx.response.status = 200;
	} catch (err) {
		logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
		ctx.response.status = 500;
	}
});

router.delete("/:id", async (ctx) => {
	const cnx = await postgres.connect();
	try {
		const sql = `
      delete from nighthawk."001" where id = $1
    `;
		await cnx.query(sql, [parseInt(ctx.params.id, 10)]);
		ctx.response.status = 200;
	} catch (err) {
		logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
		ctx.response.status = 500;
	}
});

router.put("/", async (ctx) => {
	const cnx = await postgres.connect();
	try {
		const sql = `
      select * from nighthawk."001"
    `;
		const result = await cnx.query(sql);
		ctx.response.body = !!result.rows.length ? result.rows : [];
	} catch (err) {
		logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
		ctx.response.status = 500;
	}
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
