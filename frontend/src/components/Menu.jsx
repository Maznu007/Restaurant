import React, { useState } from 'react';
import { data } from '../restApi.json';
import { HiOutlineArrowNarrowRight, HiX } from 'react-icons/hi';

const Menu = () => {
  const [selectedDish, setSelectedDish] = useState(null);

  const openRecipe = (dish) => {
    setSelectedDish(dish);
    document.body.style.overflow = 'hidden';
  };

  const closeRecipe = () => {
    setSelectedDish(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <section className='menu' id='menu'>
        <div className="container">
          <div className="heading_section">
            <div>
              <h1 className="heading">SEASONAL <span>OFFERINGS</span></h1>
              <p>Our menu changes with what's growing. These dishes represent what our farmers brought us this week.</p>
            </div>
          </div>
          
          <div className="dishes_container">
            {data[0].dishes.map(element => (
              <div 
                className="card" 
                key={element.id}
                onClick={() => openRecipe(element)}
              >
                <div className="cardImage">
                  <img src={element.image} alt={element.title} />
                </div>
                
                <div className="cardInfo">
                  <div className="cardCategory">{element.category}</div>
                  <div className="cardTitle">{element.title}</div>
                </div>
                
                <div className="cardHover">
                  <p className="cardDescription">{element.description}</p>
                  <div className="cardCta">
                    View Full Recipe <HiOutlineArrowNarrowRight />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe Modal */}
      <div className={`recipe_modal ${selectedDish ? 'active' : ''}`} onClick={closeRecipe}>
        {selectedDish && (
          <div className="recipe_modal_content" onClick={(e) => e.stopPropagation()}>
            <button className="recipe_modal_close" onClick={closeRecipe}>
              <HiX />
            </button>
            <img 
              src={selectedDish.image} 
              alt={selectedDish.title} 
              className="recipe_modal_image" 
            />
            <div className="recipe_modal_body">
              <div className="recipe_modal_header">
                <h2>{selectedDish.title}</h2>
                <div className="recipe_modal_meta">
                  <span>{selectedDish.category}</span>
                  <span>•</span>
                  <span>{selectedDish.prepTime}</span>
                  <span>•</span>
                  <span>Serves {selectedDish.serves}</span>
                </div>
              </div>
              
              <p className="recipe_modal_description">{selectedDish.description}</p>
              
              <div className="recipe_modal_grid">
                <div className="recipe_modal_section">
                  <h4>Ingredients</h4>
                  <ul className="recipe_ingredients">
                    {selectedDish.ingredients.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="recipe_modal_section">
                  <h4>Chef's Note</h4>
                  <p className="recipe_note">"{selectedDish.chefNote}"</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Menu;