<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        $user = auth()->user();

        if ($user->hasRole('superadmin')) {
            return redirect()->intended('/admin');
        }

        if ($user->hasRole('kecamatan')) {
            return redirect()->intended('/kecamatan');
        }

        return redirect()->intended('/users');
    }
}
