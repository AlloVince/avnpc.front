import { withRouter } from 'next/router';
import { Icon } from 'antd';
import 'react';

const ActiveLink = ({ children, router, href, icon }) => {
  const className = router.pathname === href ? 'active' : null;

  const handleClick = (e) => {
    router.push(href);
  };

  return (
    <div onClick={handleClick} className={className}>
      <Icon type={icon}/>
      {children}
    </div>
  );
};

export default withRouter(ActiveLink);
