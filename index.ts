import { serve } from "https://deno.land/std@0.180.0/http/server.ts";

interface User {
	x: number;
	y: number;
	color: number;
	path: string;
}

function newUser(): User {
	return {
		x: Math.random() * 90,
		y: Math.random() * 90,
		color: Math.random() * 360,
		path: "/" + Math.random()
	}
}
let users: User[] = [];

function listUsers(pathname: string) {
	let html = `
<!doctype html>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width">
<style>
b { position: absolute; font-size: 300%;}
b.me { font-size: 500%; }
</style>
	`;
	users.forEach(u => {
		let cn = (u.path == pathname ? "me" : "");
		let style = `left:${u.x}%; top:${u.y}%; filter:hue-rotate(${u.color}deg);`;
		html += `<b style="${style}" class="${cn}">😍</b>`
	});
	return new Response(html, {headers: {"content-type":"text/html"}});
}


async function handler(req: Request) {
	let url = new URL(req.url);
	if (url.pathname == "/") {
		let user = newUser();
		users.push(user);
		return Response.redirect(new URL(user.path, url));
	} else {
		return listUsers(url.pathname);
	}

	return new Response("...");
}

serve(handler)