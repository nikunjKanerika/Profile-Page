// Adding event listener to "Links" button to display the page of adding new links
document.getElementById('links-tab').addEventListener('click', function() {
  document.getElementById('profile-content').classList.add('hidden');
  document.getElementById('links-content').classList.remove('hidden');
  document.getElementById('preview-box').classList.add('hidden');
  document.getElementById('main-page').classList.remove('hidden');
  document.querySelector('#links-tab').classList.add('btn-outline-primary');
  document.querySelector('#profile-tab').classList.remove('btn-outline-primary');
});

// Adding event listener to "Profile Details" button to display the page of Profile Section
document.getElementById('profile-tab').addEventListener('click', function() {
  document.getElementById('links-content').classList.add('hidden');
  document.getElementById('profile-content').classList.remove('hidden');
  document.getElementById('preview-box').classList.add('hidden');
  document.getElementById('main-page').classList.remove('hidden');
  document.querySelector('#profile-tab').classList.add('btn-outline-primary');
  document.querySelector('#links-tab').classList.remove('btn-outline-primary');
});

// Change image overlay
document.querySelector('.change-image-overlay').addEventListener('click', function() {
  document.getElementById('fileInput').click();
});

// Image upload 
document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      localStorage.setItem('imgURI', encodeURIComponent(e.target.result));
      document.querySelector('.profile-img').src = e.target.result;
      
      // Update profile data with the new image URL
      let profileData = JSON.parse(localStorage.getItem('profile')) || {};
      profileData.imgURI = e.target.result;
      localStorage.setItem('profile', JSON.stringify(profileData));
    }
    reader.readAsDataURL(file);
  }
});

// Function of adding a new list of link
const addNewLink = () => {
  const linkSection = document.getElementById('link-section');
  const linkCount = linkSection.children.length + 1;
  const linkItem = document.createElement('div');
  linkItem.className = 'link-item';
  linkItem.innerHTML = `
    <h3>Link #${linkCount}</h3>
    <div>
      <label for="platform${linkCount}">Platform</label>
      <select class="form-control" id="platform${linkCount}">
        <option>GitHub</option>
        <option>YouTube</option>
        <option>LinkedIn</option>
      </select>
    </div>
    <div>
      <label for="link${linkCount}">Link</label>
      <input type="url" class="form-control" id="link${linkCount}" placeholder="https://www.example.com/username" required>
    </div>
    <button type="button" class="btn btn-outline-secondary btn-remove">Remove</button>
  `;

  linkSection.appendChild(linkItem);

  linkItem.querySelector('.btn-remove').addEventListener('click', function() {
    linkItem.remove();
  });
}

// Show the preview page of the user
const showPreview = () => {
  document.getElementById('main-page').classList.add('hidden');
  document.querySelector('#preview-box').classList.remove('hidden');

  const profileData = JSON.parse(localStorage.getItem('profile'));
  const linksData = JSON.parse(localStorage.getItem('links'));

  if (profileData) {
    document.getElementById('fullName').innerText = `${profileData.firstName} ${profileData.lastName}`;
    document.getElementById('emailId').innerText = profileData.email;
    if (profileData.imgURI) {
      document.querySelector('#preview-section .profile-img').src = profileData.imgURI;
    }
  }

  const linksList = document.querySelector('.links-list');
  linksList.innerHTML = '';
  if (linksData) {
    linksData.forEach(link => {
      const linkDiv = document.createElement('div');
      const anchor = document.createElement('a');
      anchor.href = link.link;
      anchor.target = '_blank';
      anchor.innerText = link.platform;

      // Set the background color based on the platform
      switch (link.platform) {
        case 'GitHub':
          anchor.style.backgroundColor = 'black';
          anchor.style.color = 'white'; 
          break;
        case 'YouTube':
          anchor.style.backgroundColor = 'red';
          anchor.style.color = 'white'; 
          break;
        case 'LinkedIn':
          anchor.style.backgroundColor = '#0e76a8'; 
          anchor.style.color = 'white'; 
          break;
        default:
          anchor.style.backgroundColor = '#f8f9fa'; 
          break;
      }
      linkDiv.appendChild(anchor);
      linksList.appendChild(linkDiv);
    });
  }
}

// Adding event listener to add new link button "Add new link" button
document.getElementById('add-link-btn').addEventListener('click', addNewLink);
document.getElementById('preview-btn').addEventListener('click', showPreview);

let data = {};
// Function for validation of the details filled by user in profile section
(function() {
  'use strict';
  window.addEventListener('load', function() {
    let forms = document.getElementsByClassName('needs-validation');
    Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          // Store form data in localStorage
          if (form.id === 'profile-form') {
            data = {
              firstName: document.getElementById('first-name').value,
              lastName: document.getElementById('last-name').value,
              email: document.getElementById('email').value,
            };
            const imgURI = localStorage.getItem('imgURI');
            if (imgURI) {
              data.imgURI = decodeURIComponent(imgURI);
            }
            localStorage.setItem('profile', JSON.stringify(data));
          }
          if (form.id === 'link-section') {
            const links = Array.from(form.getElementsByClassName('link-item')).map(linkItem => {
              const platform = linkItem.querySelector('select').value;
              const link = linkItem.querySelector('input').value;
              return { platform, link };
            });
            localStorage.setItem('links', JSON.stringify(links));
          }
        }
        form.classList.add('was-validated');
      }, false);
    });

    // Custom validation and saving logic for the links form
    document.getElementById('save-links').addEventListener('click', function() {
      const linkSection = document.getElementById('link-section');
      if (linkSection.checkValidity() === false) {
        linkSection.classList.add('was-validated');
      } else {
        // Store links data in localStorage
        const links = Array.from(linkSection.getElementsByClassName('link-item')).map(linkItem => {
          const platform = linkItem.querySelector('select').value;
          const link = linkItem.querySelector('input').value;
          return { platform, link };
        });
        localStorage.setItem('links', JSON.stringify(links));
      }
    });
  }, false);
})();
