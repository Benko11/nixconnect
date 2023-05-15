<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stash extends Model
{
    use HasFactory;

    protected $fillable = ['stashable_type', 'stashable_id'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function stashable() {
        return $this->morphTo();
    }
}
