for EXAMPLE in ./examples/*;
    do mkdir -p $EXAMPLE/plugins;
    rm -rf $EXAMPLE/plugins/gatsby-source-api
    cp -r dist $EXAMPLE/plugins/gatsby-source-api;
    cp package.json $EXAMPLE/plugins/gatsby-source-api/
done;
