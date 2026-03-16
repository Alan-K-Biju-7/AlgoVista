          setJ(j - 1);
        } else {
          setActivePseudoLine(7);
          setStepExplanation(
            `Since ${key} is not less than ${arr[j] ?? 'start'}, place it at position ${
              j + 1
            }.`
          );
          arr[j + 1] = key;
          pushHistory(`Inserted key ${key} at index ${j + 1}.`);
          setPhase('insert');
        }
      } else if (phase === 'insert') {
        moveToNextElement(arr);
      }

      return arr;
    });
  };
