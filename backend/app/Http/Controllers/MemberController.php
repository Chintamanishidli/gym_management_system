<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index()
    {
        return response()->json(Member::orderBy('id')->get());
    }
    public function store(Request $request)
{
    $validated = $request->validate([
        'name'  => ['required', 'string', 'max:255'],
        'phone' => ['required', 'string', 'max:20'],
        'email' => ['nullable', 'email', 'max:255'],
    ]);

    $member = Member::create($validated);

    return response()->json($member, 201);
}
}