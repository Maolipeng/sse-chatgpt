import { Link, Outlet } from 'umi';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.navs}>
      <ul>
        <li>
          <Link to="/sse">SSE Demo</Link>
        </li>
        <li>
          <Link to="/ws">Websocket Demo</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
