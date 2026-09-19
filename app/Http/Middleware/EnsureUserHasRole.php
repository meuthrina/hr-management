<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // This middleware checks if the authenticated user has one of the specified roles. It takes a variable number of role strings as arguments and verifies if the user's role matches any of them. If the user does not have the required role, it aborts the request with a 403 Forbidden response, indicating that the user does not have permission to access the requested area. If the user has the required role, the request is passed to the next middleware or controller.
        if (! $request->user() || ! $request->user()->hasRole(...$roles)) {
            abort(403, 'You do not have permission to access this area.');
        }

        return $next($request);
    }
}
