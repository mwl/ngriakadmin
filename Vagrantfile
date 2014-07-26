Vagrant::configure("2") do |config|
  config.vm.define :riak do |box|
    box.vm.host_name = 'riak'

    box.vm.box = 'ubuntu/precise64'

    box.vm.network "private_network", ip: '33.33.33.33'
    box.vm.network "forwarded_port", guest: 8098, host: 8098

    $script = <<SCRIPT
      set -x
      set -u
      set -e

      curl http://apt.basho.com/gpg/basho.apt.key | sudo apt-key add -
      sudo bash -c "echo deb http://apt.basho.com $(lsb_release -sc) main > /etc/apt/sources.list.d/basho.list"
      sudo apt-get update
      sudo apt-get install riak
      sudo update-rc.d riak defaults
      sudo sed -i 's/127\.0\.0\.1/0.0.0.0/g' /etc/riak/app.config
      sudo service riak restart
SCRIPT

    box.vm.provision "shell", inline: $script
  end
end