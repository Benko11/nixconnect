<?php

use App\Http\Controllers\GenderController;
use App\Http\Controllers\PronounController;
use App\Http\Controllers\SearchController;
use App\Models\ColourScheme;
use App\Models\Font;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/fonts', function() {
    return Font::all();
});

Route::get('/colour-schemes', function() {
    return ColourScheme::all();
});

Route::get('/search/{query}', [SearchController::class, 'search']);