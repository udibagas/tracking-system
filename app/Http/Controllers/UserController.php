<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sort = $request->sort ?? 'name';
        $order = $request->order ?? 'asc';

        $users = User::when($request->search, function ($query, $search) {
            $query->where('name', 'ILIKE', '%' . $search . '%')
                ->orWhere('email', 'ILIKE', '%' . $search . '%');
        })->orderBy($sort, $order)->paginate($request->pageSize ?? 10);

        if ($request->wantsJson()) {
            return $users;
        }

        return Inertia::render('Users/Index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return User::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $user;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $user->update($request->all());
        return $user;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}
