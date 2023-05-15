<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pronoun extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable = ['word'];

    public function users() {
        return $this->belongsToMany(User::class);
    }
}
