import { Link, Router } from '../routes';
import ActiveLink from './ActiveLink';

export default ({ route, pagination }) => {
  return pagination.total > 0 ?
    <div className="pagination">
      <ul>
        <li><Link route={route}
                  params={{ offset: pagination.prev, limit: pagination.limit }}><a>Prev</a></Link></li>
        <li><Link route={route}
                  params={{ offset: pagination.next, limit: pagination.limit }}><a>Next</a></Link></li>
      </ul>
    </div>
    : null;
};
