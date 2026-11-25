<?php
use App\Http\Controllers\MemberController;
use Illuminate\Support\Facades\Route;

Route::get('/members', [MemberController::class, 'index']);
Route::post('/members', [MemberController::class, 'store']);