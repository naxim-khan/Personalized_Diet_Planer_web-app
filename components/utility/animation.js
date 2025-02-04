export const FadeUp = (delay) => {
    return {
      hidden: {
        opacity: 0,
        y: 100
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delay: delay,
          duration: 1,
          ease: "easeInOut"
        }
      }
    };
  };
  
  export const FadeLeft = (delay) => {
    return {
      hidden: {
        opacity: 0,
        x: 100
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          delay: delay,
          duration: 1,
          ease: "easeInOut"
        }
      }
    };
  };
  
  export const FadeRight = (delay) => {
    return {
      hidden: {
        opacity: 0,
        x: -100
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          delay: delay,
          duration: 1,
          ease: "easeInOut"
        }
      }
    };
  };
  