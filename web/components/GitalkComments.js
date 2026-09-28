'use client';

import { useEffect, useRef, useState } from 'react';

const clientID = process.env.NEXT_PUBLIC_GITALK_CLIENT_ID;
const proxy = process.env.NEXT_PUBLIC_GITALK_OAUTH_PROXY;

export default function GitalkComments({ post }) {
  const containerRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    const container = containerRef.current;
    if (!clientID || !proxy || !container) return () => { active = false; };

    import('gitalk').then(({ default: Gitalk }) => {
      if (!active) return;
      setLoadError(false);
      const gitalk = new Gitalk({
        clientID,
        repo: 'avnpc.content',
        owner: 'AlloVince',
        admin: ['AlloVince'],
        id: post.commentId,
        labels: ['Gitalk'],
        title: post.title,
        proxy,
        createIssueManually: true,
        distractionFreeMode: false,
        language: 'zh-CN',
      });
      gitalk.render(container);
    }).catch(() => {
      if (active) setLoadError(true);
    });

    return () => {
      active = false;
      container.replaceChildren();
    };
  }, [post.commentId, post.title]);

  if (!clientID || !proxy) {
    return <p className="service-note" role="status">评论配置尚未完成。配置 GitHub OAuth Client ID 和 OAuth 代理后即可启用。</p>;
  }

  return <section className="gitalk-section" aria-label="文章评论">
    {loadError && <p className="service-note" role="status">评论组件加载失败，请稍后重试。</p>}
    <div ref={containerRef}/>
  </section>;
}
