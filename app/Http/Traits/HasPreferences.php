<?php

namespace App\Http\Traits;

use App\Models\Preference;

trait HasPreferences {
    public function preferences() {
        return $this->belongsToMany(Preference::class)->withPivot('value');
    }

    public function togglePrivate() {
        $preference = Preference::where('slug', 'private-profile')->firstOrFail()->id;
        
        $newValue = 0;
        $oldValue = $this->preferences->where('slug', 'private-profile')->first()->pivot->value;
        if ($oldValue == 0) $newValue = 1;

        $this->preferences()->syncWithoutDetaching([$preference => ['value' => $newValue]]);
    }

    public function changeBackground($background) {
        $preference = Preference::where('slug', 'background')->firstOrFail()->id;
        $this->preferences()->syncWithoutDetaching([$preference => ['value' => $background]]);
    }

    public function changeMaxPostSize($maxPostSize) {
        $preference = Preference::where('slug', 'max-post-size')->firstOrFail()->id;
        $this->preferences()->syncWithoutDetaching([$preference => ['value' => $maxPostSize]]);
    }

    public function changeFont($fontFamily, $fontSize = null, $lineHeight = null) {
        $fontFamilyPreference = Preference::where('slug', 'font-family')->firstOrFail()->id;

        if ($fontSize != null) {
            $fontSizePreference = Preference::where('slug', 'font-size')->firstOrFail()->id;
            $lineHeightPreference = Preference::where('slug', 'line-height')->firstOrFail()->id;

            $this->preferences()->syncWithoutDetaching([
                $fontFamilyPreference => ['value' => $fontFamily],
                $fontSizePreference => ['value' => $fontSize],
                $lineHeightPreference => ['value' => $lineHeight]
            ]);
        } else {
            $this->preferences()->syncWithoutDetaching([
                $fontFamilyPreference => ['value' => $fontFamily],
            ]);
        }
    }

    public function changeColourScheme($colourScheme) {
        $preference = Preference::where('slug', 'colour-scheme')->firstOrFail()->id;
        $this->preferences()->syncWithoutDetaching([$preference => ['value' => $colourScheme]]);
    }

    public function changeFlashMessage($side, $length) {
        $preferenceSide = Preference::where('slug', 'flash-message-side')->firstOrFail()->id;
        $this->preferences()->syncWithoutDetaching([$preferenceSide => ['value' => $side]]);

        $preferenceLength = Preference::where('slug', 'flash-message-length')->firstOrFail()->id;
        $this->preferences()->syncWithoutDetaching([$preferenceLength => ['value' => $length]]);
    }

    public function isPrivate() {
        return $this->preferences()->where('slug', 'private-profile')->firstOrFail()->pivot->value == 1;
    }

    public function toggleDisplayed(bool $email, bool $dateOfBirth) {
        $preferenceEmail = Preference::where('slug', 'display-email')->firstOrFail()->id;
        $this->preferences()->syncWithoutDetaching([$preferenceEmail => ['value' => $email]]);

        $preferenceDateOfBirth = Preference::where('slug', 'display-date-of-birth')->firstOrFail()->id;
        $this->preferences()->syncWithoutDetaching([$preferenceDateOfBirth => ['value' => $dateOfBirth]]);
    }
}