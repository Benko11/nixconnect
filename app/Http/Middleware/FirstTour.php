<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class FirstTour
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()->isToured()) {
            return redirect()->route('tour.start');
        }

        return $next($request);
    }
}
