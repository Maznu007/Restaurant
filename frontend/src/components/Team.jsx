import React from "react";
import { data } from "../restApi.json";

const Team = () => {
  return (
    <section className="team" id="team">
      <div className="container">
        <div className="heading_section">
          <div>
            <h1 className="heading">THE <span>KITCHEN</span></h1>
            <p>Four people, one oven, fourteen farm relationships. Small teams create better food.</p>
          </div>
        </div>
        
        <div className="team_container">
          {data[0].team.map((element) => (
            <div className="card" key={element.id}>
              <img src={element.image} alt={element.name} />
              <div className="cardContent">
                <h3>{element.name}</h3>
                <p className="designation">{element.designation}</p>
                <p className="bio">{element.bio}</p>
                <p className="quote">"{element.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;