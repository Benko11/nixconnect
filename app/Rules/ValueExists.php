<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\InvokableRule;

class ValueExists implements InvokableRule
{
    /**
     * Indicates whether the rule should be implicit.
     *
     * @var bool
     */
    public $implicit = true;

    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     * @return void
     */
    public function __invoke($attribute, $value, $fail)
    {
        if ($value == null) {
            $fail("Error occurred, please try again later.");
            return;
        }

        if (!in_array(true, $value)) {
            $fail(':attribute is mandatory');
        }
    }
}
