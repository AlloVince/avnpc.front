import React from 'react';
import {
  Button, Icon, Divider, BackTop, Popover, Tooltip
} from 'antd';
import { DateTime } from 'luxon';
import { Link } from '../routes';
import markdown from '../markdown';

const ButtonGroup = Button.Group;

export default class extends React.Component {
  static defaultProps = {
    post: {}
  };

  state = {
    visible: false
  };

  hide = () => {
    this.setState({
      visible: false
    });
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  showTOC() {
    const [toc] = document.getElementsByClassName('toc');
    const tocMinWidth = 130;
    const tocMargin = 15;
    if (!toc) {
      return;
    }
    const [page] = document.getElementsByClassName('page-content');
    if (window.innerWidth - tocMinWidth < page.offsetLeft + page.clientWidth) {
      toc.style.display = 'none';
      return;
    }

    // console.log(tocMinWidth, window.innerWidth - page.offsetLeft - page.clientWidth - 30)
    toc.style.display = 'block';
    toc.style.position = 'fixed';
    toc.style.width = `${Math.max(tocMinWidth, window.innerWidth - page.offsetLeft - page.clientWidth - tocMargin * 2)}px`;
    toc.style.left = `${page.offsetLeft + page.clientWidth + tocMargin}px`;
    toc.style.top = `${Math.max(page.offsetTop - document.documentElement.scrollTop, 0)}px`;
  }

  codepen() {
    const links = document.querySelectorAll('.markdown a[href^="https://codepen.io/AlloVince/pen/"]');
    if (!links || links.length < 1) {
      return;
    }
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = e.target.href;
        const match = href.match(/https:\/\/codepen.io\/AlloVince\/pen\/(\w+)(\?h=(\d+))?/i);
        if (!match) {
          return;
        }
        e.preventDefault();
        const [, id, , height] = match;
        const iframe = `<iframe height="${height || 265}" style="width: 100%;" scrolling="no" src="//codepen.io/AlloVince/embed/${id}/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true"></iframe>`;
        e.target.parentNode.innerHTML = iframe;
        return;
      });
    })
  }

  componentDidMount() {
    const gitalkLibId = 'gitalk_lib';
    const gitalkPostId = `POST_${this.props.post.id}`;
    const renderGitalk = () => {
      const script = document.createElement('script');
      script.text = `
    (new Gitalk({
      clientID: '5d9637564dd639b523c6',
      clientSecret: '8946007888a18d7c4bd4bef28128866394ff86b8',
      repo: 'avnpc.content',
      owner: 'AlloVince',
      admin: ['AlloVince'],
      id: '${gitalkPostId}',
      distractionFreeMode: false
    })).render('gitalk-container');
    `;
      document.body.appendChild(script);
    };

    if (document.getElementById(gitalkLibId)) {
      renderGitalk();
    } else {
      const gitalkLib = document.createElement('script');
      gitalkLib.id = gitalkLibId;
      gitalkLib.src = 'https://unpkg.com/gitalk@latest/dist/gitalk.min.js';
      gitalkLib.onload = renderGitalk;
      document.body.appendChild(gitalkLib);
    }

    const mermaidLibId = 'mermaid_lib';
    const renderMermaid = () => {
      const script = document.createElement('script');
      script.text = `
      mermaid.init({}, ".mermaid");
    `;
      document.body.appendChild(script);
    };
    if (document.getElementById(mermaidLibId)) {
      renderMermaid();
    } else {
      const mermaidLib = document.createElement('script');
      mermaidLib.id = mermaidLibId;
      mermaidLib.src = 'https://unpkg.com/mermaid@8.0.0-rc.6/dist/mermaid.min.js';
      mermaidLib.onload = renderMermaid;
      document.body.appendChild(mermaidLib);
    }

    window.addEventListener('resize', this.showTOC);
    window.addEventListener('scroll', this.showTOC);
    this.showTOC();
    this.codepen();
  }

  render() {
    const { post } = this.props;
    const content = markdown().render(post.text.content);
    return (
      <div className="page-content">
        <div>
          <div className="page-header">
            <h1>
              <Link route="p" params={{ id: post.id }} href={`/p/${post.id}`}>
                <a rel="nofollow" href={`/p/${post.id}`}>{post.title}</a>
              </Link>
            </h1>
          </div>

          {post.type === 'note' ?
            <p className="copyright">
              文章来源:
              <a href={post.sourceUrl}>{post.source || post.sourceUrl || '未记录'}</a>
            </p> :
            <p className="copyright">
              日志未经声明，均为
              <a href="/about">AlloVince</a>
              原创。本作品采用
              <a
                rel="license"
                href="http://creativecommons.org/licenses/by-nc/4.0/"
              >
                知识共享署名-非商业性使用 4.0 国际许可协议
              </a>
              进行许可。
            </p>
          }


          <article className="markdown">
            <div dangerouslySetInnerHTML={{ __html: content }}/>
            <div>
              {post.tags.length > 0 &&
              <p className="tags">
                Tags :
                {post.tags.map((tag) => {
                  return (
                    <Link key={`tag-${tag.id}`} href={`/thinking?tag=${tag.tagName}`}>
                      <a href={`/thinking?tag=${tag.tagName}`}>
                        <Icon type="tags"/>
                        {tag.tagName}
                      </a>
                    </Link>
                  );
                })}
              </p>
              }
              {post.type === 'article' &&
              <p>
                Donate：
                <a
                  href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=allo.vince@gmail.com&currency_code=USD&amount=0.99&return=http://avnpc.com&item_name=Blog%20Of%20AlloVince&undefined_quantity=1&no_note=0">Buy
                  me a coffee
                </a>
                |文章有帮助，可以
                <Popover
                  placement="top"
                  content={<img src="/static/images/buy-me-a-coffee.png" width="150px"/>}
                  trigger="click"
                  visible={this.state.visible}
                  onVisibleChange={this.handleVisibleChange}
                >
                  <a href="#">
                    请我喝杯咖啡
                    <Icon type="coffee"/>
                  </a>
                </Popover>
              </p>
              }
            </div>
          </article>

          {post.contentStorage === 'remote' ?
            <Divider orientation="right">
              <Tooltip title="本文位于Github, 可发起PR编辑内容">
                <a
                  href={`https://github.com/AlloVince/avnpc.content/blob/master/source/_posts/${DateTime.fromMillis(post.createdAt * 1000).toFormat('yyyy')}/${post.slug}.md`}
                >
                  勘误
                  <Icon type="edit"/>
                </a>
              </Tooltip>
            </Divider>
            : <Divider/>
          }

          {(post.prev || post.next) &&
          <div style={{ textAlign: 'center' }}>
            <ButtonGroup>
              <Button
                type="dashed"
                size="large"
                disabled={post.prev ? '' : 'disabled'}
                title={post.prev ? `${post.prev.title}` : ''}
              >
                <Icon type="left"/>
                <Link href={post.prev ? `/pages/${post.prev.slug}` : 'javascript:;'}><a>上一篇</a></Link>
              </Button>
              <Button
                type="dashed"
                size="large"
                title={DateTime.fromMillis(post.createdAt * 1000).toLocaleString()}
              >
                <Icon type="calendar"/>
              </Button>
              <Button
                type="dashed"
                size="large"
                disabled={post.next ? '' : 'disabled'}
                title={post.next ? `${post.next.title}` : ''}
              >
                <Link href={post.next ? `/pages/${post.next.slug}` : 'javascript:;'}><a>下一篇</a></Link>
                <Icon type="right"/>
              </Button>
            </ButtonGroup>
          </div>
          }

          <div style={{ textAlign: 'center', margin: '20px' }}>
            <img src="/static/images/telegram.png" width="256px"/>
            <br/>
            <a href={'https://t.me/joinchat/HKvcQAw2kqASoYfxiSrIbA'} target={'_blank'}>Join My Telegram Group</a>
          </div>

          {post.commentStatus === 'open' &&
          <div id="gitalk-container"/>
          }
          <BackTop/>
        </div>
      </div>
    );
  }
}
