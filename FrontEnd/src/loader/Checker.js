import './Complete.css'

export function Done(){
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52">
            <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="3" stroke-miterlimit="10" cx="26" cy="26" r="24"/>
            <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" points="40,18 20,37 10,24 "/>
        </svg>

    )
}