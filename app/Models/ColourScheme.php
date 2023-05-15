<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ColourScheme extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['primary', 'secondary', 'tertiary', 'quaternary', 'foreground', 'foreground_dark', 'error'];
}
