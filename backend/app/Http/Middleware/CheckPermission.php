<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission{

    public function handle(Request $request, Closure $next, $permission){
        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'],
            );
        }

        $hasPermission = $user->role->permissions()
                                    ->where('slug', $permission)
                                    ->exists();
        if(!$hasPermission){
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản bạn không có quyền '. $permission],
            );            
        }
        return $next($request);
    }
}
