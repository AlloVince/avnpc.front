import React, { createElement } from 'react';
import { Button } from 'antd';

const config = {
  401: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg',
    title: '401',
    desc: '抱歉，你无权访问该页面'
  },
  403: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg',
    title: '403',
    desc: '抱歉，你无权访问该页面'
  },
  404: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg',
    title: '404',
    desc: '抱歉，你访问的页面不存在'
  },
  500: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg',
    title: '500',
    desc: '抱歉，服务器出错了'
  },
};

const Exception = ({
  linkElement = 'a', type, title, desc, img, actions
}) => {
  const pageType = type in config ? type : '404';
  return (
    <div className="exception" style={{ height: '100%', minHeight: '100vh', justifyContent: 'center' }}>
      <div className="imgBlock">
        <div
          className="imgEle"
          style={{ backgroundImage: `url(${img || config[pageType].img})` }}
        />
      </div>
      <div className="content">

        <h1>{title || config[pageType].title}</h1>
        <div className="desc">{desc || config[pageType].desc}</div>
        <div className="actions">
          {actions ||
          createElement(
            linkElement,
            {
              to: '/',
              href: '/',
            },
            <Button type="primary">返回首页</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exception;
