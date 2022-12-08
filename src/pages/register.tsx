import React, { useEffect, useState } from "react";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
// @ts-ignore
import { history } from "umi";

export default function () {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  async function submit() {
    try {
      if (!name || !email || !password) {
        alert("请完善表单");
      }
      setLoading(true);
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, avatarUrl }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      if (res.status !== 200 && res.status !== 201) {
        const text = await res.text();
        console.error(text);
        alert(text);
        return;
      }
      const data = await res.json();
      alert(`去登录吧${data.name}`);
      history.push("/login");
    } catch (e: any) {
      setLoading(false);
      console.error(e);
    }
  }

  return (
    <div className="w-full flex justify-center">
      {loading && <span>正在注册</span>}
      {!loading && (
        <div className="container lg:px-64 px-8 pt-16">
          <p className="text-3xl font-extrabold">用户注册</p>
          <div className="mt-8">
            <p>名字</p>
            <TextInput value={name} onChange={setName} />
            <p>邮箱</p>
            <TextInput value={email} onChange={setEmail} />
            <p className="mt-4">密码</p>
            <TextInput value={password} onChange={setPassword} />
            <p>头像地址</p>
            <TextInput value={avatarUrl} onChange={setAvatarUrl} />
            {avatarUrl && <img width={100} src={avatarUrl} />}
            <Button onClick={submit}>提交注册</Button>
          </div>
        </div>
      )}
    </div>
  );
}
