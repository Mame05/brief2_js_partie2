

const form = document.getElementById('form');
const libelle = document.getElementById('libelle');
const categorie = document.getElementById('categorie');
const description = document.getElementById('description');
const cardContainer = document.getElementById('card-container');

form.addEventListener('submit', e => {
    e.preventDefault();
    validateInputs();
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidLibelle = (value) => {
    return value.length >= 10 && value.length <= 40;
};

const isValidDescription = (value) => {
    return value.length >= 10 && value.length <= 255;
};

const validateInputs = () => {
    const libelleValue = libelle.value.trim();
    const categorieValue = categorie.value.trim();
    const descriptionValue = description.value.trim();

    let isFormValid = true;

    // Libelle
    if (libelleValue === '') {
        isFormValid = false;
        setError(libelle, 'Le libellé est requis');
    } else if (!isValidLibelle(libelleValue)) {
        isFormValid = false;
        setError(libelle, 'Le libellé doit contenir entre 10 et 40 caractères');
    } else {
        setSuccess(libelle);
    }

    // Catégorie
    if (categorieValue === '') {
        isFormValid = false;
        setError(categorie, 'La catégorie est requise');
    } else {
        setSuccess(categorie);
    }

    // Description
    if (descriptionValue === '') {
        isFormValid = false;
        setError(description, 'La description est requise');
    } else if (!isValidDescription(descriptionValue)) {
        isFormValid = false;
        setError(description, 'La description doit contenir entre 10 et 255 caractères');
    } else {
        setSuccess(description);
    }

    if (isFormValid) {
        // Ajouter l'idée
        addIdea(libelleValue, categorieValue, descriptionValue);

        // Masquer le formulaire d'ajout
        document.getElementById('form').style.display = 'none';

        // Masquer le message d'erreur
        document.getElementById('messageErreur').style.display = 'none';

        // Afficher le message de succès
        document.getElementById('messageSucces').style.display = 'block';

        // Masquer le message de succès après 2 secondes et réafficher le formulaire
        setTimeout(function() {
            document.getElementById('messageSucces').style.display = 'none';
            document.getElementById('form').style.display = 'block';
            document.getElementById('form').reset();  // Réinitialiser le formulaire
        }, 2000);
    } else {
        // Masquer le formulaire d'ajout
        document.getElementById('form').style.display = 'none';

        // Masquer le message de succès
        document.getElementById('messageSucces').style.display = 'none';

        // Afficher le message d'erreur
        document.getElementById('messageErreur').style.display = 'block';

        // Masquer le message d'erreur après 2 secondes et réafficher le formulaire
        setTimeout(function() {
            document.getElementById('messageErreur').style.display = 'none';
            document.getElementById('form').style.display = 'block';
        }, 2000);
    }
};

const addIdea = (libelle, categorie, description, status = '') => {
    const card = document.createElement('div');
    card.classList.add('col-md-4');

    let buttonsHTML = `
        <a href="#" class="btn btn-success btn-sm approver">Approuver</a>
        <a href="#" class="btn btn-danger btn-sm desapprouver">Désapprouver</a>
        <a href="#" class="btn btn-danger btn-sm delete" onclick="return confirm('Êtes-vous sûr de vouloir supprimer cette idée ?');">
        <i class="fas fa-trash-alt"></i>
        </a>
       `;

    if (status === 'approuve') {
        buttonsHTML = `<p class="status-text text-success">Approuvé</p>`;
        card.querySelector('.card').classList.add('border-success');
    } else if (status === 'desapprouve') {
        buttonsHTML = `<p class="status-text text-danger">Désapprouvé</p>`;
        card.querySelector('.card').classList.add('border-danger');
    }

    card.innerHTML = `
    <div class="card mb-3">
        <div class="card-body">
            <h5 class="card-title">${libelle}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${categorie}</h6>
            <p class="card-text">${description}</p>
            <div class="card-buttons">${buttonsHTML}</div>
        </div>
    </div>`;

    // Réinitialiser le formulaire aprés l'ajout
    document.getElementById('form').reset();  

    document.getElementById('card-container').appendChild(card);
    if (status === ''){
        card.querySelector('.approver').addEventListener('click', () => {
            card.querySelector('.card-buttons').innerHTML = `<p class="status-text text-success">Approuvé</p>`;
            card.querySelector('.card').classList.add('border-success');
            card.querySelector('.card').classList.remove('border-danger');
            updateIdeaStatus(libelle, 'approuve');
        });
        card.querySelector('.desapprouver').addEventListener('click', () => {
            card.querySelector('.card-buttons').innerHTML = `<p class="status-text text-danger">Désapprouvé</p>`;
            card.querySelector('.card').classList.add('border-danger');
            card.querySelector('.card').classList.remove('border-success');
            updateIdeaStatus(libelle, 'desapprouve');
        });
        card.querySelector('.delete').addEventListener('click', () => {
            card.remove();
            deleteIdea(libelle);
        });

    }
    
    // Sauvegarder l'idée dans le local storage
    saveIdeaToLocalStorage(libelle, categorie, description);
};
document.addEventListener('DOMContentLoaded', loadIdeasFromLocalStorage);

const saveIdeaToLocalStorage = (libelle, categorie, description) => {
    const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
    ideas.push({ libelle, categorie, description });
    localStorage.setItem('ideas', JSON.stringify(ideas));
};

const loadIdeasFromLocalStorage = () => {
    const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
    ideas.forEach(idea => {
        addIdea(idea.libelle, idea.categorie, idea.description);
    });
};

const deleteIdea = (libelle) => {
    let ideas = JSON.parse(localStorage.getItem('ideas')) || [];
    ideas = ideas.filter(idea => idea.libelle !== libelle);
    localStorage.setItem('ideas', JSON.stringify(ideas));
};

const updateIdeaStatus = (libelle, status) => {
    const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
    const idea = ideas.find(idea => idea.libelle === libelle);
    if (idea) {
        idea.status = status;
        localStorage.setItem('ideas', JSON.stringify(ideas));
    }
};