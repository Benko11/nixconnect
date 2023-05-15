@extends('errors::minimal')

@section('code', '404')
@section('message', __($exception->getMessage() ?: 'Not Found'))
