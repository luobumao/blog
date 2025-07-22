import { sidebar } from "vuepress-theme-hope";

export default sidebar({
    "/": [
        {
        text: "首页",
        icon: "home",
        link: "/",
        },
        {
        text: "博客",
        icon: "blog",
        link: "/blog/",
        },
        {
        text: "项目",
        icon: "project-diagram",
        link: "/projects/",
        },
        {
        text: "关于我",
        icon: "user",
        link: "/about/",
        },
    ],
    "/blog/": [
        {
        text: "博客文章",
        icon: "pen-to-square",
        children: [
            { text: "文章1", link: "/blog/article1" },
            { text: "文章2", link: "/blog/article2" },
        ],
        },
    ],
});