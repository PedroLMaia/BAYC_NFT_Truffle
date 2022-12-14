App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        petTemplate.find('.pet-price').text(data[i].price);
        petTemplate.find('.pet-num').text(data[i].num);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    await window.ethereum.enable();
  } catch (error) {
    console.error("User denied account access")
  }
}
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      App.contracts.Adoption.setProvider(App.web3Provider);
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Comprado!').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  getPrices: async function(){
    return $.getJSON('../pets.json');
  },
  
  handleAdopt: async function(event) {

    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    let pets = await App.getPrices();
    let pet = pets.find((price) => price.id == petId);
    var petValue = pet.price;

    var adoptionInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.adopt(petId, { value:web3.toWei(petValue, 'ether'), from: account });
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
