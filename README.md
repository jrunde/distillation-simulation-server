Biofuels Game Running On Rails
------------------------------

to run you must have some way to access both MRI Ruby and JRuby w/ Java7 (for now). first compile the java model:

> javac -cp javaGame/json-simple-1.1.1.jar javaGame/*.java

execute server_runner.rb with jruby, for example using

> rvm jruby exec ruby javaGame/server_runner.rb

then run

> bundle install
>
> thin start