document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('index-kw').value = 11;
    document.getElementById('index-bn').click();
});

setTimeout(() => {
    let a = document.createElement('a');
    a.href = 'foxreport://data to report';
    document.body.appendChild(a);
    a.click();
}, 1000);
