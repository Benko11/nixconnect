<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\VerifyUserMail;
use App\Models\Gender;
use App\Models\Preference;
use App\Models\Pronoun;
use App\Models\User;
use App\Models\UserMedium;
use App\Providers\RouteServiceProvider;
use App\Rules\GenderExists;
use App\Rules\ValueExists;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Auth/Register', [
            'genders' => Gender::orderBy('id', 'asc')->get(),
            'pronouns' => Pronoun::orderBy('id', 'asc')->get()
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'firstName' => ['nullable', 'max:255'],
            'lastName' => ['nullable', 'max:255'],
            'email' => ['nullable', 'email:spoof', 'unique:users,email', 'max:255'],
            'nickname' => ['required', 'unique:users,nickname'],
            'password' => ['required', 'confirmed', 'min:8'],
            'genders' => [],
            'pronouns' => [new ValueExists],
            'dateOfBirth' => ['nullable', 'date_format:Y-m-d', 'after:1910-01-01', 'before:2005-01-01'],
            'policies' => ['accepted']
        ], [
            'nickname.required' => 'This is your unique identifier on '. config('app.name') .', you must fill it in',
            'pronouns' => 'We need to be able to refer to you! Please select at least one that applies'
        ]);

        // create a user
        $data = [
            'nickname' => $request->nickname,
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'date_of_birth' => $request->dateOfBirth,
            'password' => $request->password,
        ];

        // skip email verification if no email is present
        if (!$request->filled('email')) {
            $data['email_verified_at'] = now();
        }

        $user = User::create($data);

        // associate empty media with the user (to be filled later)
        $user->media()->save(new UserMedium());

        auth()->login($user);

        event(new Registered($user));

        $user->addGenders(request('genders'));
        $user->addPronouns(request('pronouns'));

        $preferences = Preference::all();
        foreach ($preferences as $preference) {
            $user->preferences()->attach($preference, ['value' => $preference->default]);
        }

        return redirect(RouteServiceProvider::HOME);
    }
}
