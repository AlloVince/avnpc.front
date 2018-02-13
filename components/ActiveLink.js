import { withRouter } from 'next/router';
import 'react';

// typically you want to use `next/link` for this usecase
// but this example shows how you can also access the router
// using the withRouter utility.

const ActiveLink = ({ children, router, href }) => {
  const className = router.pathname === href ? 'a' : null;

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <span onClick={handleClick} className={className}>
      {children}
    </span>
  );
};

export default withRouter(ActiveLink);
