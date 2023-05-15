<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Gender;
use App\Models\Pronoun;
use App\Models\User;
use App\Rules\ValueExists;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function accountDataForm() {
        return Inertia::render('Settings/AccountData/AccountData', [
            'user' => User::with('genders', 'pronouns')->find(auth()->id()),
            'genders' => Gender::orderBy('id', 'asc')->get(),
            'pronouns' => Pronoun::orderBy('id', 'asc')->get()
        ]);
    }

    public function personalInfoPost() {
        request()->validate([
            'firstName' => ['nullable', 'max:255'],
            'lastName' => ['nullable', 'max:255'],
            'email' => ['nullable', 'email:spoof', Rule::unique('users')->ignore(auth()->id(), 'uuid'), 'max:255'],
            'dateOfBirth' => ['nullable', 'date_format:Y-m-d', 'after:1910-01-01', 'before:2005-01-01'],
            'bio' => ['nullable', 'max:5000']
        ]);

        $user = User::find(auth()->id());

        // if email changed, remove previous verification to verify the new email
        if (auth()->user()->email != request()->get('email')) {
            $user->email_verified_at = null;
            auth()->user()->sendEmailVerificationNotification();
        }

        $user->first_name = request()->get('firstName');
        $user->last_name = request()->get('lastName');
        $user->email = request()->get('email');
        $user->date_of_birth = request()->get('dateOfBirth');
        $user->bio = request()->get('bio');
        $user->save();

        return redirect()->back();
    }

    public function passwordChangePost() {
        request()->validate([
            'oldPassword' => ['required', 'current_password'],
            'newPassword' => ['required', 'min:8', 'confirmed']
        ], [
            '*.confirmed' => 'Passwords do not match'
        ]);

        $user = User::find(auth()->id());
        $user->password = request('newPassword');
        $user->save();

        return redirect()->back();
    }

    public function deleteAccountPost() {
        request()->validate([
            'password' => ['required', 'current_password'],
            'consent' => ['required', 'in:'.env('USER_DELETE_CONFIRMATION')]
        ], [
            'consent.in' => 'Consent is invalid. Please type in "'.env('USER_DELETE_CONFIRMATION').'"'
        ]);

        // trash account
        $user = User::find(auth()->id());
        $user->delete();

        // TODO: activate cron

        // log out
        Auth::guard('web')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }

    public function genderPronounPost() {
        request()->validate([
            'genders' => [],
            'pronouns' => [new ValueExists]
        ], [
            'pronouns' => 'We need to be able to refer to you! Please select at least one that applies'
        ]);

        auth()->user()->genders()->detach();
        auth()->user()->pronouns()->detach();
        
        auth()->user()->genders()->attach($this->newResourceIds('genders', 'App\Models\Gender'));
        auth()->user()->pronouns()->attach($this->newResourceIds('pronouns', 'App\Models\Pronoun'));

        return redirect()->back();
    }

    public function updateBio() {
        request()->validate([
            'biography' => ['max:5000']
        ]);
        $user = User::find(auth()->id());
        $user->bio = request('biography');
        $user->save();

        return redirect()->back();
    }

    public function newResourceIds($request, $model) {
        $itemsArray = [];
        foreach (request($request) as $key => $item) {
            if ($item)
                $itemsArray[] = $key;
        }

        $items = $model::orderBy('id', 'asc')->get()->toArray();
        $ids = [];

        foreach ($itemsArray as $index) {
            $ids[] = $items[$index]['id'];
        }

        return $ids;
    }

}
