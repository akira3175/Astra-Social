import {Navigate, Outlet} from 'react-router-dom';
import type { User } from '../../types/user';

export default function PermissionRoute({ user, permission }: { user: User | null | undefined; permission: string }) {
	if (!user) return <Navigate to="/login" replace />

	const hasPermission = user.role?.permissions?.some(
		(p: { group: string }) => p.group.toLowerCase() === permission.toLowerCase()
	);
	if (!hasPermission)
		return <Navigate to="/404" replace />
	return <Outlet/>
}