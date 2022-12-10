import React, { useState, useEffect } from "react";
import TextInput from "../components/TextInput";
import Button from "../components/Button";

// @ts-ignore
import { history } from "umi";

export default function () {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	async function submit() {
		try {
			setLoading(true);
			const res = await fetch("/api/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			setLoading(false);
			if (res.status !== 200) {
				console.error(await res.text());
				return;
			}
			const data = await res.json();
			alert(`欢迎回来，${data.name}`);
			history.push("/posts/create");
		} catch (err) {
			setLoading(false);
			console.error(err);
			alert(err);
		}
	}

	function register() {
		history.push("/register");
	}

	useEffect(() => {
		// 刚进来验证是否登录，如果登录了直接跳转到posts创建页面
		console.log(document.cookie);
	}, []);

	return (
		<div className="w-full flex justify-center">
			{loading && "登录中..."}
			{!loading && (
				<div className="container lg:px-64 px-8 pt-16">
					<p className="text-3xl font-extrabold">用户登入</p>
					<div className="mt-8">
						<p>邮箱</p>
						<TextInput value={email} onChange={setEmail} />
						<p className="mt-4">密码</p>
						<TextInput value={password} onChange={setPassword} />
						<Button onClick={submit}>登入</Button>
						<Button onClick={register} className="ml-8">
							注册
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
