import TextInput from "../../components/TextInput";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { history, useParams } from "umi";
import Button from "../../components/Button";

export default function () {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [loading, setLoading] = useState(false);

	const params = useParams();
	const [post, setPost] = useState<any>();

	async function refresh() {
		try {
			setLoading(true);
			const res = await fetch("/api/posts/" + params.postId);
			const post = await res.json();
			setLoading(false);
			if (res.status === 200) {
				setTitle(post.title);
				setContent(post.content);
				setTags(post.tags);
				setImageUrl(post.imageUrl);
			} else {
				setPost(null);
			}
		} catch (err) {
			console.error(err);
			setLoading(false);
		}
	}

	useEffect(() => {
		if (!document.cookie.includes("token")) {
			alert("请先登录");
			history.push("/login");
			return;
		}
		refresh();
	}, []);

	async function submit() {
		try {
			setLoading(true);
			const res = await fetch("/api/posts", {
				method: "PUT",
				body: JSON.stringify({
					id: params.postId,
					title,
					content,
					tags: tags.split(","),
					imageUrl,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			setLoading(false);
			if (res.status !== 200) {
				console.error(await res.text());
				alert("更新失败");
				return;
			}
			history.push(`/posts/${params.postId}`);
		} catch (err) {
			console.error(err);
			setLoading(false);
		}
	}

	return (
		<div className="w-full flex justify-center">
			{loading && (
				<div className="fixed w-screen h-screen flex justify-center items-center">
					<p className="animate-pulse">Loading...</p>
				</div>
			)}
			{!loading && (
				<div className="container lg:px-64 px-8 pt-16">
					<p className="text-3xl font-extrabold">更新文章</p>
					<p className="mt-8">标题</p>
					<TextInput value={title} onChange={setTitle} />
					<p className="mt-8">内文</p>
					<TextInput textArea value={content} onChange={setContent} />
					<p className="mt-8">标签 (以逗号隔开)</p>
					<TextInput value={tags} onChange={setTags} />
					<p className="mt-8">封面图片地址</p>
					<TextInput value={imageUrl} onChange={setImageUrl} />
					<img src={imageUrl} alt="" />
					<Button onClick={submit}>更新</Button>
				</div>
			)}
		</div>
	);
}
