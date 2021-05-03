App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {

    if (window.tomochain) {
      App.web3Provider = window.tomochain;
      try {
        // Request access to account
        await window.tomochain.enable();
      } catch (error) {
        window.alert('You need to allow Pantograph.');
        return;
      }
    }

    web3 = new Web3(App.web3Provider);

    window.web3app = web3;
    
    return App.initContract();
  },

  initContract: function() {

    console.log('init contract')

      $.getJSON('Adoption.json', function(data) {
          
          console.log('Adoption.json', data)

          // Get the necessary contract artifact file and instantiate it with truffle-contract
          // var AdoptionArtifact = data;
          // Set the provider for our contract
          App.contracts.Adoption = TruffleContract(data);  
          console.log('Adoption contract', App.contracts.Adoption )
          window.Adoption = App.contracts.Adoption
          // Use our contract to retrieve and mark the adopted pets    
          App.contracts.Adoption.setProvider(App.web3Provider);      
          return App.markAdopted();
        });
       
      return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-adopters', App.markAdopted);
    $(document).on('click', '.btn-reset-adopters', App.unadoptAll);
  },

  unadoptAll: function() {
    App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.unadoptAll();
      }).then(function(adopters) {
        console.log('adopters cleared!', adopters)
      }).catch(function(err) {
        console.log('Unadopt all error', err)
        console.log(err.message);
      });
  },

  markAdopted: function(adopters, account) {
  
      console.log('mark adopted')
      var deployed;

  

      App.contracts.Adoption.deployed().then(function(instance) {
        deployed = instance;
        return deployed.getAdopters.call();

      }).then(function(adopters) {
 
       console.log('adopters', adopters)

        for (i = 0; i < adopters.length; i++) {
          if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
            $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
          }
        }
      }).catch(function(err) {
        console.log('mark adopted error', err)
        console.log(err.message);
      });


  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;    

    web3.eth.getAccounts(function(error, accounts) {

      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      console.log('handle adopt account', account)

      let deployed = App.contracts.Adoption.deployed();

      console.log('deployed', deployed)
      console.log('App.contracts.Adoption', App.contracts.Adoption)


      App.contracts.Adoption.deployed().then(function(instance) {
        // Execute adopt as a transaction by sending account
 
        console.log('handle adopt instance', instance)
        return instance.adopt(petId, {from: account});

      }).then(function(result) {
        console.log('handle Adopt result', result)
        return App.markAdopted();

      }).catch(function(err) {
        console.log('handle Adopt final error', err)
        console.log(err.message);
      });
    });

  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
