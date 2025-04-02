import "../styles/Faces.css";

const Popups = (props) => {
  return props.trigger ? (
    <div className="custom-popup">
      <div className="popup-content">
        <button
          className="close-button"
          onClick={() => props.setTrigger(false)}
        >
          X
        </button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
};

export default Popups;
