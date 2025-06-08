import React from "react";
import './css/admin.css';
import Title from "./title";
import StatusList from "./StatusList";
import FilialList from "./FilialList";
import Settings from "./Settings";
import Banners from "./Banners"
import Contacts from "./Contacts";
import WorkingHoursForm from "./WorkingHoursForm";
const MyCargo = () => {

    return (
      
        <div className="my-cargo mainAdmin">
            <Title text="Мой карго"/>
            <div className="section-my-cargo">
                <Settings/>
                <div className="my-cargo-flex2">
                    <Contacts/>
                    <WorkingHoursForm/>
                </div>
            </div>
            <div className="section-my-cargo">
                <Banners/>

            </div>
            <div className="section-my-cargo">
                <StatusList/>
                <FilialList/>

            </div>


        </div>

    )
}

export default MyCargo;