import { Link, Router } from '../routes';

export default ({ post }) => (
  <div className="page-content">
    <div id="blog">
      <div className="page-header large">
        <h1>
          <Link route="p" params={{ id: post.id }}><a rel="nofollow">{post.title}</a></Link>
        </h1>
      </div>

      <p className="copyright">
          <span className="pull-left">
              日志未经声明，均为<a href="https://plus.google.com/104171418568283484752?rel=author">AlloVince</a>原创。版权采用<a
            rel="license" href="http://creativecommons.org/licenses/by-nc/2.5/cn/" target="_blank">『 知识共享署名-非商业性使用 2.5 许可协议』</a>进行许可。
          </span>
        <span className="share-btn pull-left">
              <span className="addthis_toolbox addthis_default_style ">
                  <a className="addthis_button_twitter"></a>
                  <a className="addthis_button_facebook"></a>
                  <a className="addthis_button_google_plusone_share"></a>
                  <a className="addthis_button_sinaweibo"></a>
                  <a className="addthis_button_douban"></a>
              </span>
          {/*<script type="text/javascript">var addthis_config = {"data_track_addressbar":false};</script>*/}
          </span>
        <span className="pull-left">
          </span>


      </p>
      <article className="typo typocn">
        <div dangerouslySetInnerHTML={{ __html: post.text.markedContent }}/>
        {() => {
          return post.tags.length > 0 ?
            <div>
              <p className="tags"> Tags :
                {post.tags.map((tag) => {
                  return (
                    <Link route="tags" params={{ name: tag.tagName }} className="label tag"><a>{tag.tagName}</a></Link>
                  );
                })}
              </p>
              < p className="share"> Follow :
                <span data-url-wrap="http://avnpc.com/feed/"><i className="icon-social-rss"></i></span>
                <span data-url-wrap="https://github.com/AlloVince"><i className="icon-social-github-circled"></i></span>
                <span data-url-wrap="http://www.facebook.com/allovince"><i className="icon-social-facebook-squared"></i></span>
                <span
                  data-url-wrap="https://twitter.com/intent/follow?source=followbutton&variant=1.0&screen_name=AlloVince"><i
                  className="icon-social-twitter"></i></span>
                <span data-url-wrap="https://plus.google.com/104171418568283484752"><i
                  className="icon-social-googleplus-rect"></i></span>
                <span data-url-wrap="http://weibo.com/avnpc"><i className="icon-social-weibo"></i></span>
                <span data-url-wrap="http://www.linkedin.com/in/qianxu"><i
                  className="icon-social-linkedin-squared"></i></span>
                <span data-url-wrap="https://www.evernote.com/pub/allovince/Tech"><i
                  className="icon-social-evernote"></i></span>
              </p>
              <p>
                Donate：<a
                href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=allo.vince@gmail.com&currency_code=USD&amount=0.99&return=http://avnpc.com&item_name=Blog%20Of%20AlloVince&undefined_quantity=1&no_note=0">Buy
                me a coffee <span className="icon-coffee"></span></a> | 文章有帮助，可以<a
                href="https://me.alipay.com/allovince">请我喝杯咖啡 <span className="icon-coffee"></span></a>
              </p>
            </div>
            : null;
        }}

        <hr/>

      </article>

      {/*<?if($item['Prev'] || $item['Next']):?>*/}
      {/*<div className="neighbors">*/}
      {/*<?if($item['Prev']):?>*/}
      {/*<a href="<?=$this->uri('/pages/' . $item['Prev']['urlName'])?>" className="prev"*/}
      {/*title="<?=$this->escapeHtmlAttr($item['Prev']['title'])?>"><span className="icon-ext icon-arrow-left"></span></a>*/}
      {/*<?else:?>*/}
      {/*<a href="#" className="prev" title="没有了"><span className="icon-ext icon-arrow-left"></a>*/}
      {/*<?endif;?>*/}
      {/*<div className="postdate">*/}
      {/*<abbr className="gmtdate" title="本篇日志发布于：<?=$this->datetime($item['createTime']);?>">*/}
      {/*<span className="month"><?=$this->datetime($item['createTime'], null, 'M');?></span>*/}
      {/*<span className="day"><?=$this->datetime($item['createTime'], null, 'd');?></span>*/}
      {/*</abbr>*/}
      {/*</div>*/}
      {/*<?if($item['Next']):?>*/}
      {/*<a href="<?=$this->uri('/pages/' . $item['Next']['urlName'])?>" className="next"*/}
      {/*title="<?=$this->escapeHtmlAttr($item['Next']['title'])?>"><span*/}
      {/*className="icon-ext icon-arrow-right"></span></a>*/}
      {/*<?endif;?>*/}
      {/*</div>*/}
      {/*<?endif;?>*/}
    </div>
  </div>
);
