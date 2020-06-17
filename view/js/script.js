
const headers = ['SL', 'Date', 'Diagnosis', 'Weight', 'Doctor'];

const btn = document.getElementById('submit-btn')
const loader = document.getElementById('loader-view')

const patientName = document.getElementById('patient-name')
const patientDob = document.getElementById('patient-dob')
const patientHeight = document.getElementById('patient-height')

const tableHeader = document.getElementById('table-header')
const tableBody = document.getElementById('table-body')

let userDetails = []

async function sendRequest(){
    let sel = document.getElementById('patient-select')
    let ID = +sel.options[sel.selectedIndex].value
    if(ID !== -1){
      //loader and btn
      btn.setAttribute('disabled', true)
      btn.classList.add('disabled')
      loader.style.display = 'block'
      //

      let res = await fetch(`https://jsonmock.hackerrank.com/api/medical_records?userId=${ID}`)
      if(res.ok){
        userDetails = await res.json()
        console.log(userDetails)
        rangeDates = []
        userDetails.data.forEach((item)=>{
          rangeDates.push(item.timestamp)
        })
        rangeDates.sort()
        rangeDates.reverse()
        userDetailsData = []
        rangeDates.forEach(item=>{
          itemToPush = userDetails.data.find(date=>date.timestamp === item)
          userDetailsData.push(itemToPush)
        })
        userDetails.data = userDetailsData

        //loader and btn deactivate
        loader.style.display = 'none'
        btn.removeAttribute('disabled')
        btn.classList.remove('disabled')

        //remove old table and create new
        tableHeader.innerHTML = ''
        tableBody.innerHTML = ''
        createUserSummary()
        createTable()
      }
    }    
}

function createUserSummary(){
  patientName.innerHTML = userDetails.data[0].userName
  patientDob.innerHTML = userDetails.data[0].userDob
  patientHeight.innerHTML = `Height: ${userDetails.data[0].meta.height} sm`
}

function createTable(){
  // add table header
  tableHeader.insertRow()
  headers.forEach(columnName=>{
    let th = document.createElement('th')
    th.innerText = columnName
    tableHeader.lastChild.appendChild(th)
  })

  // add table body
  userDetails.data.forEach((row,i)=>{
    tableBody.insertRow()
    let tdSL = document.createElement('td')
    let tdDate = document.createElement('td')
    let tdDiagnosis = document.createElement('td')
    let tdWeight = document.createElement('td')
    let tdDoctor = document.createElement('td')
    tdSL.innerText = row.id

    let date = new Date(row.timestamp)
    tdDate.innerText = date.toLocaleDateString('en-GB')
    tdDiagnosis.innerText = `${row.diagnosis.name}(${row.diagnosis.severity})`
    tdWeight.innerText = row.meta.weight
    tdDoctor.innerText = row.doctor.name

    tableBody.children[i].appendChild(tdSL)
    tableBody.children[i].appendChild(tdDate)
    tableBody.children[i].appendChild(tdDiagnosis)
    tableBody.children[i].appendChild(tdWeight)
    tableBody.children[i].appendChild(tdDoctor)
  })
}
