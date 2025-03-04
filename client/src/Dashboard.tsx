import type { User } from '@firebase/auth-types';

interface DashboardProps {
  user: User;
}

function Dashboard({ user }: DashboardProps): JSX.Element {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.displayName}!</h1>
      <div className="grid gap-4">
        <p>Your Dashboard Content Here</p>
      </div>
    </div>
  );
}

export default Dashboard;
