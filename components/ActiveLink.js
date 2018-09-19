import { withRouter } from 'next/router';
import 'react';

const ActiveLink = ({ children, router, href }) => {
  const className = router.pathname === href ? 'active' : null;

  const handleClick = () => {
    router.push(href);
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};

export default withRouter(ActiveLink);
