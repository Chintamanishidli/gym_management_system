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
        $member = Member::create($this->validatedDetails($request));

        return response()->json($member, 201);
    }

    public function update(Request $request, Member $member)
    {
        $member->update($this->validatedDetails($request));

        return response()->json($member);
    }

    private function validatedDetails(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);
    }
}
