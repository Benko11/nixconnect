<?php

namespace App\Http\Traits;

use App\Models\Gender;
use App\Models\Pronoun;

trait Genderable {
    public function genders() {
        return $this->belongsToMany(Gender::class);
    }

    public function pronouns() {
        return $this->belongsToMany(Pronoun::class);
    }

    public function addGender($gender) {
        $gender = (int) $gender;
        if ($gender == null) {
            Gender::create(['name' => $gender])->id;
        }

        $this->genders()->attach($this->uuid, ['gender_id' => $gender]);
    }

    public function addGenders($genders) {
        foreach ($genders as $gender) {
            $this->addGender($gender);
        }
    }

    public function addPronoun($pronoun) {
        $pronoun = (int) $pronoun;

        if ($pronoun == null) {
            Pronoun::create(['word' => $pronoun])->id;
        }

        $this->pronouns()->attach($this->uuid, ['pronoun_id' => $pronoun]);
    }

    public function addPronouns($pronouns) {
        foreach ($pronouns as $pronoun) {
            $this->addPronoun($pronoun);
        }
    }
}