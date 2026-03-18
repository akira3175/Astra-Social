import {Navigate, Outlet} from 'react-router-dom';
export default function PermissionRoute({user, permission}){
	if(!user) return <Navigate to='login' />

	const hasPermission = user.role.permissions.some(
		p=>p.group.toLowerCase()===permission.toLowerCase()
	);
	if(!hasPermission)
		return <Navigate to='/' />
	return <Outlet/>
}